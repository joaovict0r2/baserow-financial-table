export function phoneMask(value: string) {
  value = value.replace(/\D/g, "");

  if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d)/g, "$1 $2");
  }
  
  if (value.length > 4) {
    value = value.replace(/^(\d{2})\s(\d{2})(\d)/g, "$1 ($2) $3");
  }

  if (value.length > 10) {
    value = value.replace(
      /^(\d{2})\s\((\d{2})\)\s(\d{5})(\d{4})/g,
      "$1 ($2) $3-$4"
    );
  }

  return value;
}
