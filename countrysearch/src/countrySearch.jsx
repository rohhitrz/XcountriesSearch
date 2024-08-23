import { useEffect, useState } from "react";

const CountryCard = ({ name, flag, altText }) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "4px",
            alignItems: "center",
            border: "1px solid black",
            borderRadius: "8px",
            height: "200px",
            width: "200px",
            margin: "10px",
            padding: "10px"
        }}>
            <img src={flag} alt={altText} style={{ height: "100px", width: "100px" }} />
            <h2>{name}</h2>
        </div>
    );
};

const API_URL = "https://restcountries.com/v3.1/all";

function SearchBox({ setSearchQuery }) {
    return (
        <input 
            type="text"
            placeholder="Search for a country..."
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: "20px", padding: "10px", width: "200px" }}
        />
    );
}

function Countries() {
    const [countries, setCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const jsonResponse = await response.json();
                // Map the response to match the props used in CountryCard
                const formattedCountries = jsonResponse.map(country => ({
                    name: country.name.common,
                    flag: country.flags.png,
                    altText: country.cca3,
                }));
                setCountries(formattedCountries);
            } catch (e) {
                console.error("Error fetching data:", e.message);
                setError(e.message);
            }
        };
        fetchData();
    }, []);

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ padding: "20px" }}>
            <SearchBox setSearchQuery={setSearchQuery} />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {error ? (
                    <p style={{ color: "red" }}>"Error fetching data": {error}</p>
                ) : filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                        <CountryCard
                            key={country.altText}
                            name={country.name}
                            flag={country.flag}
                            altText={country.altText}
                        />
                    ))
                ) : (
                    <p>No countries match your search.</p>
                )}
            </div>
        </div>
    );
}

export default Countries;
