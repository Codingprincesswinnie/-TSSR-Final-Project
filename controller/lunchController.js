import { pool } from "../database/db.js";

export const getAllLunch = async (req, res, _next) => {
  let sqlQuery = `
    select * FROM menu_lunch
    `;
  const [menu_lunch] = await pool.query(sqlQuery);

  // error handling//
  try {
    if (menu_lunch <= 0) {
      res.status(404).json({
        status: "error",
        message: "There is no data for lunch item",
      });
    } else {
      res.status(200).json({
        status: "success",
        records: menu_lunch.length,
        data: { menu_lunch },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//create new lunch item//
export const createLunch = async (req, res, _next) => {
  let sqlQuery = `
    INSERT INTO menu_lunch (item_name, description, category, price, img)
    VALUE(?,?,?,?,?)
    `;
  try {
    const { item_name, description, category, price, img } = req.body;

    const [newLunch] = await pool.query(sqlQuery, [
      item_name,
      description,
      category,
      price,
      img,
    ]);
    res.status(200).json({
      status: "success",
      menu_lunchId: newLunch.insertId,
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({
      status: "error",
      message: "Failed to create new lunch item",
    });
  }
};

 
export const viewLunch = async (req, res, _next) => {
  const sqlQuery = `
    SELECT * FROM menu_lunch
    WHERE id = ?
    `;
  const id = req.params.id;

  // error handling//
  try {
    const [menu_lunch] = await pool.query(sqlQuery, [id]);

    if (menu_lunch.length <= 0) {
      res.status(404).json({
        status: "error",
        message: "Lunch item not found",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: menu_lunch[0],
      });
    }
  } catch (error) {
     

    res.status(404).json({
      status: "error",
      message: "Fail to retrieve lunch item",
    });
  }
};

// update lunch menu item//
export const updateLunch = async (req, res, _next) => {
 

  const sqlQuery = `
  UPDATE menu_lunch
  SET item_name = ?, description = ?, category = ?, price = ?, img = ?
   WHERE id = ?
  `;
  const { item_name, description, category, price, img } = req.body;
  const id = req.params.id;

  //error handling//
  try {
    const [uLunch] = await pool.query(sqlQuery, [
      item_name,
      description,
      category,
      price,
      img,
      id,
    ]);

    if (uLunch.affectedRows <= 0) {
      res.status(404).json({
        status: "error",
        message: "No such record to update.",
      });
    } else {
      res.status(200).json({
        status: "success",
        updatedRecordId: uLunch.affectedRows,
      });
    }
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: "error",
      message: "Fail to update lunch",
    });
  }
};

// delete one lunch item //
export const deleteLunch = async (req, res, _next) => {
  let sqlQuery = `
    DELETE FROM menu_lunch
    WHERE id = ?
    `;
  const id = req.params.id;

  // error handling//
  try {
    const [deleteLunch] = await pool.query(sqlQuery, [id]);

    if (deleteLunch.affectedRows <= 0) {
      res.status(404).json({
        status: "error",
        message: "information does not exists",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "information deleted",
        deleteRecordId: deleteLunch.affectedRows,
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
