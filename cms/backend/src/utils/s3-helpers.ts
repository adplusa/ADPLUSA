export class S3Utils {
  static extractKeyFromUrl(url: string | undefined): string | null {
    if (!url) return null;
    const urlParts = url.split(".amazonaws.com/");
    return urlParts.length > 1 ? urlParts[1] : null;
  }

  static extractKeysFromUrls(urls: (string | undefined)[]): string[] {
    return urls.map((url) => this.extractKeyFromUrl(url)).filter((key) => key !== null) as string[];
  }
}
