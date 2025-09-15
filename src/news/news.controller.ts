import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { InsertNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto';
import { ImageUploadInterceptor } from '../utils/file.upload.util';
import { AdminGuard, JwtGuard } from 'src/auth/guards';

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

  @UseGuards(JwtGuard, AdminGuard)
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

  @UseGuards(JwtGuard, AdminGuard)
  @Patch(':id')
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

  @UseGuards(JwtGuard, AdminGuard)
  @Delete('/:id')
  DeleteNews(@Param('id') id: number) {
    return this.newsService.deleteNews(id);
  }
}
