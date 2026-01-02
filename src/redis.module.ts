import { Global, Module } from "@nestjs/common";
import Redis from "ioredis";

export const REDIS_PUBSUB = 'REDIS_PUBSUB';

@Global()
@Module({
    providers: [
        {
            provide: REDIS_PUBSUB,
            useFactory: () => {
                if(!process.env.REDIS_URL){
                    throw new Error('Provide Redis URL in the environment variables.')
                }
                return new Redis(process.env.REDIS_URL)
            }
        }
    ],
    exports: [REDIS_PUBSUB]
})
export class RedisModule {}