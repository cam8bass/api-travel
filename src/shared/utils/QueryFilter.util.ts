import { Query } from "mongoose";

export default class QueryFilter {
  public query: Query<any, any>;
  private queryString: Record<any, any>;

  constructor(query: Query<any, any>, queryString: Record<any, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeQuery = ["page", "limit", "fields", "sort"];
    excludeQuery.forEach((el) => delete queryObj[el]);
    const validQuery = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query.find(JSON.parse(validQuery));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = JSON.stringify(this.queryString.sort).split(",").join(" ");
      this.query.sort(JSON.parse(sortBy));
    } else {
      this.query.sort("-createAt");
    }
    return this;
  }
  field() {
    if (this.queryString.fields) {
      const fields = JSON.stringify(this.queryString.fields)
        .split(",")
        .join(" ");
      this.query.select(JSON.parse(fields));
    } else {
      this.query.select("-__v");
    }
    return this;
  }
  page() {
    if (this.queryString.page && this.queryString.limit) {
      const page = +this.queryString.page || 1;
      const limit = +this.queryString.limit || 100;
      const skip = (page - 1) * limit;
      this.query.skip(skip).limit(limit);
    }
    return this;
  }
}
