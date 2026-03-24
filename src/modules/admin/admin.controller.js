export function listAdminCollection(req, res) {
  res.json({
    collection: req.params.collection,
    items: [],
    message: "Admin CRUD scaffold ready"
  });
}

export function createAdminCollectionItem(req, res) {
  res.status(201).json({
    collection: req.params.collection,
    payload: req.body ?? {},
    message: "Create scaffold ready"
  });
}

export function updateAdminCollectionItem(req, res) {
  res.json({
    collection: req.params.collection,
    id: req.params.id,
    payload: req.body ?? {},
    message: "Update scaffold ready"
  });
}

export function deleteAdminCollectionItem(req, res) {
  res.status(204).send();
}
