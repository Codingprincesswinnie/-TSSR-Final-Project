import { pool } from "../database/db.js";

export const getAllDinner = async (req, res, _next) => {
  let sqlQuery = `
    select * FROM menu_dinner
    `;
  const [menu_dinner] = await pool.query(sqlQuery);

  // error handling//
  try {
    if (menu_dinner <= 0) {
      res.status(404).json({
        status: "error",
        message: "There is no data for dinner item",
      });
    } else {
      res.status(200).json({
        status: "success",
        records: menu_dinner.length,
        data: { menu_dinner },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//create new dinner item//
export const createDinner = async (req, res, _next) => {
  let sqlQuery = `
    INSERT INTO menu_dinner (item_name, description, category, price, img)
    VALUE(?,?,?,?,?)
    `;
  try {
    const { item_name, description, category, price, img } = req.body;

    const [newDinner] = await pool.query(sqlQuery, [
      item_name,
      description,
      category,
      price,
      img,
    ]);
    res.status(200).json({
      status: "success",
      menu_dinnerId: newDinner.insertId,
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({
      status: "error",
      message: "Failed to create new dinner item",
    });
  }
};

// update dinner menu item//
export const updateDinner = async (req, res, _next) => {
  const uDinner = {
    item_name: req.body.item_name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    img: req.body.img,
    id: req.params.id,
  };

  try {
    const [result] = await pool.query(
      `
   UPDATE menu_Dinner
   SET item_name = ?, description = ?, category = ?, price = ?, img = ?
   WHERE id = ?
   `,
      [
        uDinner.item_name,
        uDinner.description,
        uDinner.category,
        uDinner.price,
        uDinner.img,
        uDinner.id,
      ]
    );

    // error handling//
    if (result.affectedRow <= 0) {
      res.status(404).json({
        status: "error",
        message: "Dinner item not found",
      });
    } else {
      res.status(200).json({
        status: "success",
        results: result.affectedRow,
        data: { uDinner },
      });
    }
  } catch (error) {
    console.error("Error updating dinner item", error);
    res.status(500).json({
      status: "error",
      message: "Error updating dinner item",
    });
  }
};

// view one single dinner item//
export const viewDinner = async (req, res, _next) => {
  const sqlQuery = `
    SELECT * FROM menu_dinner
    WHERE id = ?
    `;
  const id = req.params.id;

  // error handling//
  try {
    const [menu_dinner] = await pool.query(sqlQuery, [id]);

    if (menu_dinner.length <= 0) {
      res.status(404).json({
        status: "error",
        message: "Dinner item not found",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: menu_dinner[0],
      });
    }
  } catch (error) {
    res.status(404);

    res.status(404).json({
      status: "error",
      message: "Fail to retrieve dinner item",
    });
  }
};

// delete one dinner item //
export const deleteDinner = async (req, res, _next) => {
  let sqlQuery = `
    DELETE FROM menu_dinner
    WHERE id = ?
    `;
  const id = req.params.id;

  // error handling//
  try {
    const deleteDinner = await pool.query(sqlQuery, [id]);

    if (deleteDinner <= 0) {
      res.status(404).json({
        status: "error",
        message: "information does not exists",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Dinner item deleted",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(404).json({
      status: "error",
      message: "fail",
    });
  }
};
