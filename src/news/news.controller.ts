import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { InsertNewsDto } from './dto/insert.news.dto';
import { UpdateNewsDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageUploadInterceptor } from '../utils/file.upload.util';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  GetAllNews() {
    return this.newsService.getAllNews();
  }

  @Get('/:id')
  GetNewsById(@Param('id') id: number) {
    return this.newsService.getNewsById(id);
  }

  @Post()
  @ImageUploadInterceptor()
  async createNews(
    @Body() dto: InsertNewsDto,
    @UploadedFile() file?: Express.Multer.File, // Le fichier uploadé (injecté par FileInterceptor)
  ) {
    // Si un fichier est uploadé, on génère un chemin vers ce fichier
    const imageUrl = file ? `/uploads/${file.filename}` : null;

    // On envoie dto + l'URL de l'image vers la BDD via Prisma
    return this.newsService.createNews({
      ...dto,
      image_url: imageUrl,
    });
  }

  @Put(':id')
  @ImageUploadInterceptor()
  async updateNews(
    @Param('id') id: number, 
    @Body() dto: UpdateNewsDto, 
    @UploadedFile() file?: Express.Multer.File, // Nouveau fichier uploadé (optionnel)
  ) {
    // Si un nouveau fichier est envoyé -> remplace l'image
    // Sinon -> ne touche pas au champ image_url
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;

    return this.newsService.updateNews(id, {
      ...dto,
      ...(imageUrl && { image_url: imageUrl }), // Ajoute image_url seulement si défini
    });
  }

  @Delete('/:id')
  DeleteNews(@Param('id') id: number) {
    return this.newsService.deleteNews(id);
  }
}
