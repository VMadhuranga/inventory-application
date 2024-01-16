const sizeCheckBoxes = document.querySelectorAll('input[name="product-sizes"]');
const quantityCheckBoxes = document.querySelectorAll(
  'input[name="product-size-quantity"]',
);

sizeCheckBoxes.forEach((sizeCheckBox) => {
  sizeCheckBox.addEventListener("change", () => {
    quantityCheckBoxes.forEach((quantityCheckBox) => {
      if (quantityCheckBox.id.includes(sizeCheckBox.id)) {
        if (sizeCheckBox.checked) {
          quantityCheckBox.disabled = false;
        } else {
          quantityCheckBox.disabled = true;
        }
      }
    });
  });
});
