import { Request, Response } from 'express';
import Shoes from '../schemas/shoes';

const shoesHandler = async (req: Request, res: Response) => {
  
  try {
    
    const sizes = req.query.sizes as string;
    const selectedSizes = sizes ? sizes.split(",") : [];  
    
    const sortType= req.query.sort as string
    const min = parseInt(req.query.min as string);
    const max = parseInt(req.query.max as string);
    const price =req.query.price as string
    const category =req.query.category as string
    const brand = req.query.brand as string;
    const page = parseInt(req.query.page as string);
    const pageSize = parseInt(req.query.limit as string || '10');
    
    const sizeQuery = {
      'sizes': {
        $elemMatch: {
          'size': { $in: selectedSizes },
          'quantity': { $gt: 0 }
        }
      }
    };

    let query = Shoes.find();

    if (brand && brand !== 'All') {
      query = query.where('brand').equals(brand);
    }

    if (category) {
      query = query.where('category').equals(category);
    }

    if (price) {
      if (price === 'range1') {
        query = query.where('price').gte(0).lte(50);
      } else if (price === 'range2') {
        query = query.where('price').gte(50).lte(100);
      } else if (price === 'range3') {
        query = query.where('price').gte(100).lte(150);
      } else if (price === 'range4') {
        query = query.where('price').gt(150);
      }
    }

    if (min && !isNaN(min) && min > 0) {
      query = query.where('price').gte(min);
    }
    
    if (max && !isNaN(max) && max > 0) {
      query = query.where('price').lte(max);
    }
    
    if (min && max && !isNaN(min) && !isNaN(max) && min > 0 && max > 0) {
      query = query.where('price').gte(min).lte(max);
    }

    if (sizes && sizes.length > 0) {
      query = query.or([sizeQuery]);
    }

    if (sortType === 'newest') {
      query = query.sort({ _id: -1 });
    } else if (sortType === 'priceLow') {
      query = query.sort({ price: 1 }); // Sortuj według ceny od najniższej do najwyższej
    } else if (sortType === 'priceHigh') {
      query = query.sort({ price: -1 }); // Sortuj według ceny od najwyższej do najniższej
    }

    const total = await Shoes.countDocuments(query);

    if(total === 0){
      return res.status(200).json({
        status: 'success',
        message: 'Nie znaleziono butów',
      });
    }
    
    const pages = Math.ceil(total / pageSize);

    if (page > pages) {
      
      return res.status(404).json({
        status: 'fail',
        error: 'Nie znaleziono strony',
      });
    }

    const result = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize);


    res.status(200).json({
      status: 'success',
      count: result.length,
      page,
      pages,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      error: 'Wystąpił błąd',
    });
  }
};

export default shoesHandler;