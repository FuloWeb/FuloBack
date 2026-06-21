import { prisma } from "../database/prisma.js";

export type ProductSearch = {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
  color?: string;
};

export const ModuleProductSearch = {
  async search(filters: ProductSearch) {
    return prisma.product.findMany({
      where: {
        ...(filters.name && {
          name: {
            contains: filters.name,
            mode: "insensitive",
          },
        }),

        ...(filters.color && {
          color: {
            contains: filters.color,
            mode: "insensitive",
          },
        }),

        ...(filters.categoryId && {
          categoryId: filters.categoryId,
        }),

        ...((filters.minPrice !== undefined ||
          filters.maxPrice !== undefined) && {
          price: {
            ...(filters.minPrice !== undefined && {
              gte: filters.minPrice,
            }),
            ...(filters.maxPrice !== undefined && {
              lte: filters.maxPrice,
            }),
          },
        }),
      },
    });
  },
};

// usos
/* 
await ProductModel.search({
  name: "mouse",
});

await ProductModel.search({
  minPrice: 100,
});

await ProductModel.search({
  maxPrice: 500,
});

await ProductModel.search({
  minPrice: 100,
  maxPrice: 500,
});

await ProductModel.search({
  name: "teclado",
  minPrice: 150,
  maxPrice: 400,
});

await ProductModel.search({
  categoryId: 2,
  color: "preto",
});

const { name, minPrice, maxPrice, categoryId, color } = req.query;

const products = await ProductModel.search({
  name: name as string | undefined,
  minPrice: minPrice ? Number(minPrice) : undefined,
  maxPrice: maxPrice ? Number(maxPrice) : undefined,
  categoryId: categoryId ? Number(categoryId) : undefined,
  color: color as string | undefined,
});

return res.json(products);

*/
