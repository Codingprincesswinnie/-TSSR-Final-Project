import { pool } from "../database/db.js";

//viewing all reservation made//
export const getAllReservation = async (req, res, _next) => {
  let sqlQuery = `
    SELECT 
     r.id AS Reservation_ID,
  r.reservation_date AS Reservation_Date,
  r.reservation_time AS Reservation_Time,
  r.guest_count AS Amount_of_Guest,
  u.first_nam AS First_Name,
  u.last_nam AS Last_Name
FROM 
  users u
JOIN 
  reservation
  r ON u.id = r.user_id;

    `;
  const [reservation] = await pool.query(sqlQuery);

  // error handling//
  try {
    if (reservation <= 0) {
      res.status(404).json({
        status: "error",
        message: "There is no data for this reservation",
      });
    } else {
      res.status(200).json({
        status: "success",
        records: reservation.length,
        data: { reservation },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//create reservation//
export const createReservation = async (req, res, _next) => {
  let sqlQuery = `
    INSERT INTO reservation (user_id, reservation_date, reservation_time, guest_count)
    VALUE (?,?,?,?)
    `;

  // error handling//
  try {
    const { user_id, reservation_date, reservation_time, guest_count } =
      req.body;

    const [newReservation] = await pool.query(sqlQuery, [
      user_id,
      reservation_date,
      reservation_time,
      guest_count,
    ]);

    res.status(200).json({
      status: "success",
      reservationId: newReservation.insertId,
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({
      status: "error",
      message: "Fail to create new reservation",
    });
  }
};

// get single reservation information//
export const viewReservation = async (req, res, _next) => {
  const sqlQuery = `
    SELECT * FROM reservation
    WHERE id = ?
    `;
  const id = req.params.id;

  // error handling//
  try {
    const [reservation] = await pool.query(sqlQuery, [id]);

    if (reservation.length <= 0) {
      res.status(404).json({
        status: "error",
        message: "There is no reservation available",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: reservation[0],
      });
    }
  } catch (error) {
    res.status(404);

    res.status(404).json({
      status: "error",
      message: "Fail to retrieve information",
    });
  }
};

// update a customer reservation//
export const updateReservation = async (req, res, _next) => {
  let sqlQuery = `
    UPDATE reservation
    SET user_id = ?, reservation_date = ?, guest_count = ?
    WHERE id = ?
    `;

  const uReservation = await pool.query(sqlQuery, [
    id,
    user_id,
    reservation_date,
    guest_count,
  ]);

  if (uReservation.affectedRow <= 0) {
    res.status(404).json({
      status: "error",
      message: "No such record to update",
    });
  } else {
    res.status(200).json({
      status: "success",
      updateReservation: uReservation.affectedRow,
    });
  }
};

// delete a single reservation//
export const deleteReservation = async (req, res, _next) => {
  let sqlQuery = `
    DELETE FROM reservation
    WHERE id = ?
    `;
  const id = req.params.id;

  // error handling//
  try {
    const deleteReservation = await pool.query(sqlQuery, [id]);

    if (deleteReservation <= 0) {
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
