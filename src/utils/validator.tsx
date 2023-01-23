export const emailValidator = (email: string) => {
    const re = /\S+@\S+\.\S+/;
  
    if (!email || email.length <= 0) return 'Email cannot be empty.';
    if (!re.test(email)) return 'Ooops! We need a valid email address.';
  
    return '';
  };

export const phoneValidator = (phone: string) => {
  const re = /^\d+$/;

  if (!phone || phone.length <= 0) return 'Phone number cannot be empty.';
  if (!re.test(phone)) return 'Ooops! We need a valid phone phone.';
  return '';
};
  

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';
  if (!password || password.length <= 6) return 'Password must be at least 7 Symbols long.';
  return '';
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';

  return '';
};

export const offerNameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Offer name cannot be empty.';
  if (name.length >= 50) return 'Offer name has to be shorter than 50 characters.';

  return '';
};

export const offerDescriptionValidator = (name: string) => {
  if (name.length >= 250) return 'Offer description has to be shorter than 250 characters.';

  return '';
};

export const offerPriceValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Offer name cannot be empty.';

  return '';
};