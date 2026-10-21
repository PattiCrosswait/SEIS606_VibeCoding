export interface UnavailableResponse {
  status: "unavailable";
  message: string;
}

export interface SearchUnavailableResponse extends UnavailableResponse {
  matches: [];
}
