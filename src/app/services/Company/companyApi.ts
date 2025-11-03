
export const fetchCompanies = async () => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/companies`
    );
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};

export const fetchCompaniesById = async (id: string) => {

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/?id=${id}`,
        { cache: "no-store" }
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
};

