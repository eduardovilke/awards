import { Module } from "@nestjs/common";
import { NomineesService } from "./nominees.service";
import { nomineeProviders } from "./nominee.providers";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [...nomineeProviders,NomineesService]
})
export class NomineesModule {}