import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type MyContenxt = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
}