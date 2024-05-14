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

  /**
   * Filters the data based on the query parameters provided, excluding predefined parameters such as page, limit, fields, and sort.
   * It supports filtering with greater than (gt), greater than or equal to (gte), less than (lt), and less than or equal to (lte) operations.
   *
   * @returns {QueryFilterCache} The instance of QueryFilterCache with the filtered data.
   */
  filter() {
    // Copy the queryString object to avoid modifying the original query parameters
    const queryObj = { ...this.queryString };
    // Define the list of query parameters to exclude from the filtering process
    const excludeQuery = ["page", "limit", "fields", "sort"];
    // Remove the excluded query parameters from the query object
    excludeQuery.forEach((el) => delete queryObj[el]);

    // Filter the data based on the remaining query parameters
    this.data = this.data.filter((data: T) => {
      // Check if every query parameter condition is met for the data item
      return Object.entries(queryObj).every(([key, operation]) => {
        // Extract the operator (gt, gte, lt, lte) and its corresponding value
        const operator = Object.keys(operation)[0] as queryOperator;
        const value = Number(Object.values(operation)[0]);

        // Apply the filtering based on the operator
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

  /**
   * Sorts the data based on the specified sort criteria.
   *
   * The method checks if a `sort` parameter is provided in the query string. If present, it parses the parameter to determine the fields by which to sort the data. A leading "-" in the field name indicates descending order; otherwise, the sort is ascending. If no `sort` parameter is provided, the data is sorted by the `createAt` field in ascending order.
   *
   * @returns {QueryFilterCache} The instance of QueryFilterCache with the sorted data.
   */
  sort() {
    if (this.queryString.sort) {
      // Parse the sort parameter to determine the sort criteria
      const sortBy = this.queryString.sort.split(",").join(" ");

      if (sortBy.startsWith("-")) {
        // If the sort field starts with "-", perform a descending sort
        const sortField = sortBy.substring(1); // Remove the "-" sign
        this.data = this.data.sort((a, b) =>
          a[sortField] < b[sortField] ? 1 : -1
        ); // Descending sort
      } else {
        // Otherwise, perform an ascending sort
        this.data = this.data.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1)); // Ascending sort
      }
    } else {
      // Default sort by "createAt" in ascending order if no sort parameter is provided
      this.data = this.data.sort((a, b) =>
        a["createAt"] > b["createAt"] ? 1 : -1
      );
    }
    return this;
  }

  /**
   * Filters the data to only include the fields specified in the `fields` query parameter.
   * This method allows for selective field inclusion, reducing the amount of data sent over the network.
   *
   * The `fields` query parameter is expected to be a comma-separated list of field names.
   * If the `fields` parameter is provided, this method maps over the data array and constructs a new array
   * where each element only contains the specified fields. If a field is not present in an element, it is skipped.
   *
   * @returns {QueryFilterCache} The instance of QueryFilterCache with data filtered by the specified fields.
   */
  field() {
    if (this.queryString.fields) {
      // Convert the fields query parameter from a comma-separated string to a space-separated string
      // This is necessary for the inclusion check in the forEach loop
      const fields = JSON.stringify(this.queryString.fields)
        .split(",")
        .join(" ");
      // Map over the data array and construct a new array with elements containing only the specified fields
      this.data = this.data.map((el: T) => {
        const newData: Partial<T> = {};

        // Iterate over the keys of the current element and include only those specified in the fields parameter
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
  /**
   * Implements pagination on the data based on the `page` and `limit` query parameters.
   * This method calculates the starting index for slicing the data array based on the provided page number and limit,
   * effectively dividing the data into "pages" of a specified size.
   *
   * If the `page` or `limit` query parameters are not provided, it defaults to page 1 with a limit of 100.
   *
   * @returns {QueryFilterCache} The instance of QueryFilterCache with the paginated data.
   */
  page() {
    if (this.queryString.page && this.queryString.limit) {
      // Convert page and limit query parameters to numbers, defaulting to 1 and 100 respectively
      const page = +this.queryString.page || 1;
      const limit = +this.queryString.limit || 100;
      // Calculate the number of items to skip based on the current page and limit
      const skip = (page - 1) * limit;
      // Slice the data array to only include the items for the current page
      this.data = this.data.slice(skip, skip + limit);
    }
    return this;
  }
}
