export interface laravelPagination {
  current_page: Number
  data: Array
  first_page_url: String
  from: ?Number
  last_page: Number
  last_page_url: String
  links: Array
  next_page_url: ?String
  path: String
  per_page: Number
  prev_page_url: ?String
  to: ?Number
  total: Number
}
