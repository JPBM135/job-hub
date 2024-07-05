type AllowedOrderBy = Record<string, string>;

type GeneratePossibleDefaultOrderBy<T extends Record<string, any>> = keyof {
  [K in keyof T as
    | `${Extract<K, string>}_ASC`
    | `${Extract<K, string>}_DESC`]: any;
};

export function resolveOrderBy<T extends AllowedOrderBy>(
  orderBy: string,
  defaultOrderBy: GeneratePossibleDefaultOrderBy<T>,
  allowedOrderBy: T,
): { column: string; order: 'ASC' | 'DESC' } {
  const [column, order] = orderBy.split('_') as [string, 'ASC' | 'DESC'];

  const resolvedOrderBy =
    allowedOrderBy[column] ?? allowedOrderBy[defaultOrderBy]!;

  return {
    column: resolvedOrderBy,
    order: order === 'DESC' ? 'DESC' : 'ASC',
  };
}
