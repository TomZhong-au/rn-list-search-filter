import * as SQLite from "expo-sqlite";
import { SECTION_LIST_MOCK_DATA } from "./utils";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);"
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("select * from menuitems", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  const placeholder = menuItems.map((_) => "(?,?,?,?)").join(",");
  const values = menuItems
    .map(({ id, title, price, category }) => [id, title, price, category])
    .flat();

  db.transaction((tx) => {
    tx.executeSql(
      `insert into menuitems (uuid, title, price, category) values ${placeholder}`,
      values
    );
  });
}

/**
 *
 * @param {String} query
 * @param {String[]} activeCategories
 * @returns
 */
export async function filterByQueryAndCategories(query, activeCategories) {
  const placeholder = activeCategories.map(() => "?").join(",");

  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from menuitems where title like ? and category in (${placeholder})`,
        [`%${query}%`, ...activeCategories],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (e) => console.log(e)
      );
    });
  });
}
