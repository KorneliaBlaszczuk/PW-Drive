export async function loadFontBase64(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Nie udało się załadować fontu");

    const base64 = await response.text();
    return base64.trim();
}
