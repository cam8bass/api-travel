import {
  AccommodationInterface,
  ReviewInterface,
  TourInterface,
  UserInterface,
} from "../interfaces";
import { queryOperator } from "../types/types";

export default class QueryFilterCache<
  T extends
    | UserInterface
    | TourInterface
    | ReviewInterface
    | AccommodationInterface
> {
  private queryString: Record<any, any>;
  public data: T[] | [];

  constructor(queryString: Record<any, any>, data: T[] | []) {
    this.queryString = queryString;
    this.data = data;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeQuery = ["page", "limit", "fields", "sort"];
    excludeQuery.forEach((el) => delete queryObj[el]);

    this.data = this.data.filter((data: T) => {
      return Object.entries(queryObj).every(([key, operation]) => {
        const operator = Object.keys(operation)[0] as queryOperator;
        const value = Number(Object.values(operation)[0]);

        switch (operator) {
          case "gt":
            return data[key] > value ? true : false;
          case "gte":
            return data[key] >= value ? true : false;
          case "lt":
            return data[key] < value ? true : false;

          case "lte":
            return data[key] <= value ? true : false;
        }
      });
    });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      if (sortBy.startsWith("-")) {
        const sortField = sortBy.substring(1); // Supprimer le signe "-"
        this.data = this.data.sort((a, b) =>
          a[sortField] < b[sortField] ? 1 : -1
        ); // Tri décroissant
      } else {
        this.data = this.data.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1)); // Tri croissant
      }
    } else {
      this.data = this.data.sort((a, b) =>
        a["createAt"] > b["createAt"] ? 1 : -1
      );
    }
    return this;
  }

  field() {
    if (this.queryString.fields) {
      const fields = JSON.stringify(this.queryString.fields)
        .split(",")
        .join(" ");
      this.data = this.data.map((el: T) => {
        const newData: Partial<T> = {};

        Object.keys(el).forEach((prop) => {
          if (fields.includes(prop)) {
            newData[prop] = el[prop];
          }
        });
        return newData as T;
      });
    }
    return this;
  }
  page() {
    if (this.queryString.page && this.queryString.limit) {
      const page = +this.queryString.page || 1;
      const limit = +this.queryString.limit || 100;
      const skip = (page - 1) * limit;
      this.data = this.data.slice(skip, skip + limit);
    }
    return this;
  }
}
