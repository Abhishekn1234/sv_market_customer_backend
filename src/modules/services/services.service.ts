import { CategoriesDocument, CategoriesEntity } from '@faizudheen/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetCategoriesWithTopRatedServicesInput } from './dto/getCategoriesWithTopRatedServices.input';
import { PaginatedCategoriesWithTopRatedServicesDTO } from './dto/PaginatedCategoriesWithTopRatedServices.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectModel(CategoriesEntity.name)
        private readonly categoriesModel: Model<CategoriesDocument>
    ) { }

    async getCategoriesWithTopServices(
        input: GetCategoriesWithTopRatedServicesInput
    ): Promise<PaginatedCategoriesWithTopRatedServicesDTO> {

        const searchRegex = input.search
            ? new RegExp(input.search, 'i')
            : null;

        const pipeline: any[] = [
            {
                $lookup: {
                    from: 'services',
                    let: { categoryId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$category', '$$categoryId'] },
                                        { $eq: ['$isActive', true] },
                                    ],
                                },
                            },
                        },
                        {
                            $sort: {
                                avgRating: -1,
                                totalRatings: -1,
                                createdAt: -1,
                            },
                        },
                        {
                            $lookup: {
                                from: 'servicetiers',
                                localField: 'pricingTiers.tierId',
                                foreignField: '_id',
                                as: 'tierDocs',
                            },
                        },
                        {
                            $addFields: {
                                pricingTiers: {
                                    $map: {
                                        input: '$pricingTiers',
                                        as: 'pt',
                                        in: {
                                            $mergeObjects: [
                                                '$$pt',
                                                {
                                                    tier: {
                                                        $arrayElemAt: [
                                                            {
                                                                $filter: {
                                                                    input: '$tierDocs',
                                                                    as: 't',
                                                                    cond: { $eq: ['$$t._id', '$$pt.tierId'] },
                                                                },
                                                            },
                                                            0,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                tierDocs: 0,
                            },
                        },
                    ],
                    as: 'services',
                },
            }
            ,
            ...(searchRegex
                ? [
                    {
                        $addFields: {
                            services: {
                                $cond: {
                                    if: { $regexMatch: { input: '$name', regex: searchRegex } },
                                    then: '$services',
                                    else: {
                                        $filter: {
                                            input: '$services',
                                            as: 'service',
                                            cond: {
                                                $regexMatch: {
                                                    input: '$$service.name',
                                                    regex: searchRegex,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                ]
                : []),
            {
                $addFields: {
                    services: { $slice: ['$services', input.servicesLimitPerCategory] },
                },
            },
            {
                $match: {
                    'services.0': { $exists: true },
                },
            },
            {
                $skip: (input.page - 1) * input.limit,
            },
            {
                $limit: input.limit,
            },
        ];

        const data = await this.categoriesModel.aggregate(pipeline);
        const countPipeline = pipeline.filter(
            stage => !('$skip' in stage) && !('$limit' in stage)
        ).concat({ $count: 'total' });

        const totalResult = await this.categoriesModel.aggregate(countPipeline);
        const total = totalResult[0]?.total ?? 0;
        return {
            data,
            pagination: {
                totalItems: total,
                totalPages: Math.ceil(total / input.limit),
                currentPage: input.page,
                hasNextPage: input.page < Math.ceil(total / input.limit),
                hasPrevPage: input.page > 1,
            },
        };
    }






}
