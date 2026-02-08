import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
    @IsString({ message: 'Не указан заголовок' })
    title: string;

    @IsString({ message: 'Не указано описание' })
    description: string;

    @IsInt({ message: 'Не указана цена' })
    price: number;

    @MaxLength(20, { message: 'Указано слишком много свойств (максимум 20)', each: true })
    properties: string[];

    authorEmail: string;
}
