import { UserEntity, UserEntityDocument } from '@svmarket/shared/dist/users/schemas/user.schema';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { CloudinaryService, DocumentEntity, DocumentEntityDocument, KycStatus, ModuleEntity, UserDTO, UserGroup, UserGroupDocument } from '@svmarket/shared';
import * as bcrypt from 'bcrypt'
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserEntity.name)
        private readonly userModel: Model<UserEntityDocument>,
        @InjectModel(UserGroup.name)
        private readonly userGroupModel: Model<UserGroupDocument>,
        @InjectModel(DocumentEntity.name)
        private readonly documentModel: Model<DocumentEntityDocument>,
        private readonly cloudinaryService: CloudinaryService,
        
    ){}

    async createUser(input: CreateUserInput){
        const userGroup = await this.findUserGroupByName("Customer")
        if(!userGroup){
            throw new NotFoundException("Currently Customer creation not available. User group not found")
        }
        const exists = await this.findUserByEmail(input.email)
        if(exists){
            throw new BadRequestException("User already exists")
        }
        const user = await this.userModel.create({
            ...input,
            password:bcrypt.hashSync(input.password,12),
            role: userGroup._id.toString()
        })
        const createdUser = await user.save();
        const populatedUser = await this.findById(createdUser._id.toString())
        return {
            user: createdUser,
            populatedUser: new UserDTO(populatedUser!),
        }
    }

    async findUserGroupByName(name: string){
        const userGroup = await this.userGroupModel.findOne({name})
        return userGroup
    }

    async findUserByEmail(email: string){
        const user = await this.userModel.findOne({email}).populate({
                path: 'role',
                populate: {
                    path: 'modules',
                    model: ModuleEntity.name,
                },
            })
            .populate('documents')
            .exec()
        return user
    }

    async findById(id: string){
        const user = await this.userModel.findById(id)
         .populate({
                path: 'role',
                populate: {
                    path: 'modules',
                    model: ModuleEntity.name,
                },
            })
            .populate('documents')
            .exec()

        if(!user){
            throw new NotFoundException("User not found")
        }    
        return user
    }


    async updatePassword(id: string, oldPassword:string, newPassword:string){
        const user = await this.findById(id);
        if(!user){
            throw new NotFoundException("User not found")
        }
        if(!bcrypt.compareSync(oldPassword, user.password)){
            throw new BadRequestException("Old password is incorrect")
        }
        user.password = bcrypt.hashSync(newPassword,12)
        await user.save()
        return user
    }

    async updateProfile(
  id: string,
  input: UpdateUserInput,
  files?: {
    profileImage?: Express.Multer.File[];
    idProof?: Express.Multer.File[];
    addressProof?: Express.Multer.File[];
    photoProof?: Express.Multer.File[];
  }
) {
  const user = await this.findById(id);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  user.fullName = input.fullName ?? user.fullName;
  user.address = input.address ?? user.address;

  if (files?.profileImage) {
    if (user?.profilePicturePublicId) {
      await this.cloudinaryService.deleteFile(user.profilePicturePublicId);
    }

    const profileImage = await this.cloudinaryService.uploadFile(
      files.profileImage[0],
      `users/${user._id}/profileImage`
    );
    user.profilePictureUrl = profileImage.url;
    user.profilePicturePublicId = profileImage.public_id;
  }

  if (files?.idProof) {
    await this.replaceDocument(id, user, files.idProof[0], "idProof");
  }
  if (files?.addressProof) {
    await this.replaceDocument(id, user, files.addressProof[0], "addressProof");
  }
  if (files?.photoProof) {
    await this.replaceDocument(id, user, files.photoProof[0], "photoProof");
  }

  if (
    files?.idProof?.length ||
    files?.addressProof?.length ||
    files?.photoProof?.length
  ) {
    user.kycStatus = KycStatus.PENDING;
  }

  await user.save();
  return this.findById(user._id.toString());
}

    private async replaceDocument(
        userId: string,
        user: UserEntityDocument,
        file: Express.Multer.File,
        documentType: 'idProof' | 'addressProof' | 'photoProof'
    ) {
        // find old document of same type
        const oldDoc = await this.documentModel.findOne({
            _id: { $in: user.documents },
            documentType
        });

        if (oldDoc) {
            // delete from cloudinary
            await this.cloudinaryService.deleteFile(oldDoc.filePublicId);

            // remove document record
            await this.documentModel.deleteOne({ _id: oldDoc._id });

            // remove from user.documents
            user.documents = user.documents.filter(
                (docId) => docId.toString() !== oldDoc._id.toString()
            );
        }

        // upload new document
        const uploaded = await this.cloudinaryService.uploadFile(
            file,
            `users/${userId}/${documentType}`
        );

        const newDoc = await this.documentModel.create({
            fileName: file.originalname,
            filePath: uploaded.url,
            fileType: file.mimetype,
            documentType,
            filePublicId: uploaded.public_id
        });

        user.documents.push(newDoc._id.toString());
    }

}
