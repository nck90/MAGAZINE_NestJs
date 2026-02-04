export class CreateAnswerDto {
    content: string;
    questionId: number;
    emotionScore?: number;
    isPublic?: boolean;
}
