// src/utils/PrismaQueryBuilder.ts
import { Prisma } from "@prisma/client";

const excludeFields = ["page", "limit", "sort", "fields", "searchTerm"];

export class QueryBuilder<T extends object> {
    private readonly query: Record<string, string | undefined>;
    private prismaModel: any;
    private prismaArgs: any = {}; // ✅ fixed

    constructor(prismaModel: any, query: Record<string, string | undefined>) {
        this.prismaModel = prismaModel;
        this.query = query;
    }

    filter(): this {
        const filter: Record<string, any> = { ...this.query };
        excludeFields.forEach((field) => delete filter[field]);

        const where: Record<string, any> = {};
        for (const key in filter) {
            const value = filter[key];
            if (value) {
                where[key] = { equals: value };
            }
        }

        this.prismaArgs.where = where;
        return this;
    }

    search(searchableFields: string[]): this {
        const searchTerm = this.query.searchTerm || "";
        if (searchTerm) {
            const or = searchableFields.map((field) => ({
                [field]: { contains: searchTerm, mode: "insensitive" },
            }));
            this.prismaArgs.where = {
                ...(this.prismaArgs.where || {}),
                OR: or,
            };
        }
        return this;
    }

    sort(): this {
        const sort = this.query.sort || "createdAt";
        const order = sort.startsWith("-") ? "desc" : "asc";
        const sortField = sort.replace("-", "");

        this.prismaArgs.orderBy = {
            [sortField]: order,
        };
        return this;
    }

    fields(): this {
        if (this.query.fields) {
            const fieldsArray = this.query.fields.split(",");
            const select: Record<string, boolean> = {};
            fieldsArray.forEach((field) => (select[field] = true));
            this.prismaArgs.select = select;
        }
        return this;
    }

    paginate(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.prismaArgs.skip = skip;
        this.prismaArgs.take = limit;
        return this;
    }

    async build() {
        return this.prismaModel.findMany(this.prismaArgs);
    }

    async getMeta() {
        const total = await this.prismaModel.count({
            where: this.prismaArgs.where,
        });

        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const totalPage = Math.ceil(total / limit);

        return { page, limit, total, totalPage };
    }
}
