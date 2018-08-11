const gDriveRegexps = [
  /https:\/\/drive\.google\.com\/uc\?export=view&id=(.*)$/,
  /https:\/\/drive\.google\.com\/open\?\id=(.*)$/,
  /https:\/\/drive\.google\.com\/file\/d\/([^\/]*)/,
];

module.exports = function getImageUri (url, as = 'thumbnail') {
  let id;
  gDriveRegexps.some(regex => {
    if (url.match(regex)) {
      id = url.match(regex)[1];
      return true;
    }
  });

  if (id) {
      if (as === 'thumbnail') {
        return `https://drive.google.com/thumbnail?id=${id}`;
      }
      else if (as === 'original') {
        return `https://drive.google.com/thumbnail?id=${id}&sz=w2000-h2000`;
      }
  }
  return url;
};
