import { BadRequestException, Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from '../../../../shared/lesson';
import { Model } from 'mongoose';


@Controller("lessons")
export class LessonsController {

    constructor(@InjectModel("Lesson")
    private lessonsModel: Model<Lesson>) {

    }

    @Get()
    searchLesson(
        @Query("courseId") courseId: string,
        @Query("sortOrder") sortOrder = "asc",
        @Query("pageNumber", ParseIntPipe) pageNumber = 0,
        @Query("pageSize", ParseIntPipe) pageSize = 3) {

        if (!courseId) {
            throw new BadRequestException("courseId must be defined");
        }

        if (sortOrder != "asc" && sortOrder != 'desc') {
            throw new BadRequestException('sortOrder must be asc or desc');
        }

        console.log("searching for lessons ", courseId, sortOrder, pageNumber, pageSize);

        return this.lessonsModel.find({
            course: courseId
        }, null,
            {
                skip: pageNumber * pageSize,
                limit: pageSize,
                sort: {
                    seqNo: sortOrder
                }
            });
    }


}
