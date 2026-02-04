export interface ImageItem {
  link: string;
  src?: string;
  width?: number;
  height?: number;
  paddingTop?: string;
  w?: number;
  h?: number;
  ratioStr?: string;
  galleryWidth?: number;
}

interface ImageWithSize {
  width: number;
  height: number;
}

// 計算最大公約數 (GCD)
export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// 最大公約數參數
export const simplifyFraction = (numerator: number, denominator: number) => {
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
};

// 圖片比例格式化
export const formatAspectRatio = (width: number, height: number): string => {
  const { numerator, denominator } = simplifyFraction(width, height);
  return `${numerator}/${denominator}`;
};

// 圖片載入
export const addImageProcess = (src: string): Promise<ImageWithSize> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('error'));
  });
};

export const addImageSize = async (
  imageList: ImageItem[],
  defaultHeight = 100,
  galleryDefaultWidth = 250
): Promise<ImageItem[]> => {
  return await Promise.all(
    imageList.map(async (item) => {
      try {
        const imgUrl = item.link;
        const { width, height } = item;
        const img: ImageWithSize | ImageItem =
          width && height ? item : await addImageProcess(`${imgUrl}?width=20`);

        // 計算寬高比和相關屬性
        const ratioStr = formatAspectRatio(img.width!, img.height!);
        const paddingTop = `${Math.floor((img.height! / img.width!) * 100)}%`;
        const w = Math.floor((img.width! * defaultHeight) / img.height!);
        const h = defaultHeight;
        // 計算 galleryWidth，並將後兩位設置為 0
        let galleryWidth = galleryDefaultWidth;
        if (w > galleryWidth) {
          galleryWidth = Math.floor(w / 100) * 100 + 200; // 將後兩位設置為 0
        }
        return { ...item, paddingTop, w, h, ratioStr, galleryWidth };
      } catch (error) {
        console.error(`圖片加載失敗: ${item.link}`, error);
        return {
          ...item,
          src: `${process.env.rcdnWebPath}/default/wd-broken.svg`,
        };
      }
    })
  );
};
