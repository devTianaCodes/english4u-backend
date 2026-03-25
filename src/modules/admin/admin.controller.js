import { HttpError } from "../../utils/http-error.js";
import {
  createAdminCollectionEntry,
  deleteAdminCollectionEntry,
  getAdminCollectionItems,
  updateAdminCollectionEntry
} from "../../utils/demo-data.js";

export function listAdminCollection(req, res) {
  res.json({
    collection: req.params.collection,
    items: getAdminCollectionItems(req.params.collection)
  });
}

export function createAdminCollectionItem(req, res, next) {
  try {
    const item = createAdminCollectionEntry(req.params.collection, req.body ?? {});

    return res.status(201).json({
      collection: req.params.collection,
      item
    });
  } catch (error) {
    return next(new HttpError(400, error.message));
  }
}

export function updateAdminCollectionItem(req, res, next) {
  try {
    const item = updateAdminCollectionEntry(req.params.collection, req.params.id, req.body ?? {});

    return res.json({
      collection: req.params.collection,
      item
    });
  } catch (error) {
    return next(new HttpError(400, error.message));
  }
}

export function deleteAdminCollectionItem(req, res, next) {
  try {
    const item = deleteAdminCollectionEntry(req.params.collection, req.params.id);

    if (item) {
      return res.json({
        collection: req.params.collection,
        item
      });
    }

    return res.status(204).send();
  } catch (error) {
    return next(new HttpError(400, error.message));
  }
}
