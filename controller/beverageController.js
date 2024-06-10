 
import { pool } from "../database/db.js";

// getting All Beverages//
export const getAllBeverage = async (req, res, _next) => {
  let sqlQuery = `select * FROM menu_beverage`;

  const [menu_beverage] = await pool.query(sqlQuery);

  // error handling//
  try {
    if (menu_beverage <= 0) {
      res.status(404).json({
        status: "error",
        message: "There is no data for the beverage menu",
      });
    } else {
      res.status(200).json({
        status: "success",
        records: menu_beverage.length,
        data: { menu_beverage },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// create new item in beverage menu//
export const createBeverage = async (req, res, _next) => {
  let sqlQuery = `
    INSERT INTO menu_beverage (item_name, description, category, price, img)
    VALUE(?,?,?,?,?)
    `;
  // error handling//
  try {
    const { item_name, description, category, price, img } = req.body;

    const [newBeverage] = await pool.query(sqlQuery, [
      item_name,
      description,
      category,
      price,
      img,
    ]);
    res.status(200).json({
      status: "success",
      menuBeverageId: newBeverage.insertId,
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({
      status: "error",
      message: "Fail to create a new beverage item",
    });
  }
};

// view a single item from the menu_beverage//
export const viewBeverage = async (req, res, _next) => {
  const id = req.params.id;

  // error handing//
  try {
    const result = await pool.query(
      `
      SELECT * FROM menu_beverage
      WHERE id = ?
      `,
      [id]
    );

    const menu_beverage = result[0];

    if (!menu_beverage) {
      res.status(404).json({
        status: "error",
        message: "Beverage item not found",
      });
    }
    res.status(200).json({
      status: "success",
      results: menu_beverage.length,
      data: { menu_beverage },
    });
  } catch (error) {
    console.error("Error fetching single beverage item", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching single beverage item",
    });
  }
};

// update information in the menu_beverage//
export const updateBeverage = async (req, res, _next) => {
  const uBeverage = {
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
    UPDATE menu_beverage
   SET item_name = ?, description = ?, category = ?, price = ?, img = ?
    WHERE id = ?
    `,
      [
        uBeverage.item_name,
        uBeverage.description,
        uBeverage.category,
        uBeverage.price,
        uBeverage.img,
        uBeverage.id,
      ]
    );
     
    // error handling//
    if (result.affectedRow <= 0) {
      res.status(404).json({
        status: "error",
        message: "Beverage item not found",
      });
    } else {
      res.status(200).json({
        status: "success",
        results: result.affectedRow,
        data: { uBeverage },
      });
    }
  } catch (error) {
    console.error("Error updating beverage:", error);
    res.status(500).json({
      status: "error",
      message: " Error updating Beverage",
    });
  }
};

// delete single item from beverage menu//
export const deleteBeverage = async (req, res, _next) => {
  let sqlQuery = `
    DELETE FROM menu_beverage
    WHERE id = ?
    `;
  const id = req.params.id;

  //   error handling//
  try {
    const deleteBeverage = await pool.query(sqlQuery, [id]);

    if (deleteBeverage <= 0) {
      res.status(404).json({
        status: "error",
        message: "information does not exists",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "information deleted",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(404).json({
      status: "error",
      message: "Fail",
    });
  }
};
