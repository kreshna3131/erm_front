export interface Action {
  action_group: String
  id: Number
  name: String
  order_number: String
  status: String
}

export interface DetailRadiologyAction extends Action {
  visit_id: String
}
