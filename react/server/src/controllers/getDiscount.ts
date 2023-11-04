import { Request, Response } from "express";
import DiscountUser from "../schemas/discountUser";
const { v4: uuidv4 } = require("uuid");
import Discount from "../schemas/discount";

const getDiscountHandler = async (req: Request, res: Response) => {
  const userId = req.query.userId;

  let sessionId = req.cookies.sessionId;

  if (!sessionId) {
    sessionId = uuidv4();

    res.cookie("sessionId", sessionId, { httpOnly: true });
  }

  try {
    let discountUser = userId
      ? await DiscountUser.findOne({ userId: userId })
      : await DiscountUser.findOne({ sessionId: sessionId });

    const currentTimestamp = new Date().getTime();

    await DiscountUser.deleteMany({ expireDate: { $lte: currentTimestamp } });

    if (discountUser) {
      const discount = await Discount.findOne({
        _id: discountUser.discountId,
      });

      if (discount) {
        res.status(200).json({
          discountAmount: discount.discountAmount,
          discountName: discount.discountName,
        });
      } else {
        res.status(200).json({ discountAmount: 0, discountName: "" });
      }
    } else {
      res.status(200).json({ discountAmount: 0, discountName: "" });
    }
  } catch (error) {
    console.error("Błąd podczas szukania kodu rabatowego", error);
    return res
      .status(500)
      .json({ error: "Wystąpił błąd podczas szukania kodu rabatowego" });
  }
};

export default getDiscountHandler;
