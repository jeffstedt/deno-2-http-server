type Id = number;
export type Dict<T> = Record<Id, T>;

export const dictToArray = <T>(dict: Dict<T>): T[] =>
  Object.entries(dict).map(([id, value]) => ({ id: Number(id), ...value }));

export const respond = (obj: unknown, status: number = 200) => new Response(JSON.stringify(obj), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
  },
});