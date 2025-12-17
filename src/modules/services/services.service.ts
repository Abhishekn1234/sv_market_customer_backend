import { CategoriesDocument, CategoriesEntity } from '@faizudheen/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ServicesService {
    constructor(
        @InjectModel(CategoriesEntity.name)
        private readonly categoriesModel: Model<CategoriesDocument>
    ) { }

    async getCategoriesWithTopServices(limitPerCategory = 5) {
        const result = await this.categoriesModel.aggregate([
            // 1️⃣ Project category fields
            {
                $project: {
                    name: 1,
                    slug: 1,
                    iconUrl: 1,
                },
            },

            // 2️⃣ Lookup services under each category
            {
                $lookup: {
                    from: 'services',
                    let: { categoryId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$category', '$$categoryId'] }, // correct field
                                        { $eq: ['$isActive', true] },
                                    ],
                                },
                            },
                        },

                        // 3️⃣ Sort: ratings (future) → createdAt (now)
                        {
                            $sort: {
                                avgRating: -1,
                                totalRatings: -1,
                                createdAt: -1,
                            },
                        },

                        // 4️⃣ Limit per category
                        {
                            $limit: limitPerCategory,
                        },

                        // 5️⃣ Project only needed fields
                        {
                            $project: {
                                name: 1,
                                pricingTiers: 1,
                                currency: 1,
                                avgRating: 1,
                                totalRatings: 1,
                                createdAt: 1,
                            },
                        },
                    ],
                    as: 'services',
                },
            },

            // 6️⃣ Remove categories without services
            {
                $match: {
                    'services.0': { $exists: true },
                },
            },
        ]);

        // 7️⃣ Map services → price ranges
        return result.map(category => ({
            _id: category._id,
            name: category.name,
            slug: category.slug,
            iconUrl: category.iconUrl,
            services: category.services.map(service =>
                this.mapServiceWithPriceRange(service),
            ),
        }));
    }



    private mapServiceWithPriceRange(service: any) {
        const hourlyRates: number[] = [];
        const perDayRates: number[] = [];

        for (const tier of service.pricingTiers ?? []) {
            if (tier.HOURLY?.ratePerHour > 0) {
                hourlyRates.push(tier.HOURLY.ratePerHour);
            }
            if (tier.PER_DAY?.ratePerDay > 0) {
                perDayRates.push(tier.PER_DAY.ratePerDay);
            }
        }

        return {
            _id: service._id,
            name: service.name,
            avgRating: service.avgRating,
            totalRatings: service.totalRatings,
            priceRange: {
                hourly:
                    hourlyRates ?? null,
                perDay:
                    perDayRates ?? null,
            },
            currency: service.currency,
        };
    }


}
