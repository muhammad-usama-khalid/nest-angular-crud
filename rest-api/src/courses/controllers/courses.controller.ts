import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put, UseGuards
} from '@nestjs/common';
import { Course } from '../../../../shared/course';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Controller("courses")
@UseGuards(AuthenticationGuard)
export class CoursesController {

    constructor(
        @InjectModel('Course')
        private courseModel: Model<Course>
    ) {

    }

    @Post()
    @UseGuards(AdminGuard)
    async createCourse(@Body() course: Course)
        : Promise<Course> {

        const newCourse = this.courseModel(course);

        await newCourse.save();

        return newCourse.toObject({ versionKey: false });
    }

    @Get()
    async findAllCourses(): Promise<Course[]> {
        return this.courseModel.find();
    }

    @Get(":courseUrl")
    async findCourseByUrl(@Param("courseUrl") courseUrl: string) {

        console.log("Finding by courseUrl", courseUrl);

        const course = await this.courseModel.findOne({ url: courseUrl });;

        if (!course) {
            throw new NotFoundException(
                "Could not find course for url " + courseUrl);
        }

        return course;
    }



    @Put(':courseId')
    @UseGuards(AdminGuard)
    async updateCourse(
        @Param("courseId") courseId: string,
        @Body() changes: Course): Promise<Course> {

        console.log("updating course");

        if (changes._id) {
            throw new BadRequestException("Can't update course id");
        }

        return this.courseModel.findOneAndUpdate(
            { _id: courseId },
            changes,
            { new: true });
    }

    @Delete(':courseId')
    @UseGuards(AdminGuard)
    async deleteCourse(@Param("courseId") courseId: string) {

        console.log("deleting course " + courseId);

        return this.courseModel.deleteOne({ _id: courseId });
    }



}
