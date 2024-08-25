interface DockerHubTag {
    name: string;
}

export async function getPostgresVersions(): Promise<string[]> {
    try {
        const response = await fetch('https://hub.docker.com/v2/repositories/library/postgres/tags?page_size=100');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json() as { results: DockerHubTag[] };

        const versions = data.results
            .map(tag => tag.name)
            .filter(name => {
                // Filter out alpha, beta, and rc versions
                const isValidVersion = /^\d+(\.\d+)*$/.test(name);
                return isValidVersion || name === 'latest';
            })
            .sort((a, b) => {
                if (a === 'latest') return -1;
                if (b === 'latest') return 1;
                return b.localeCompare(a, undefined, { numeric: true });
            });

        return versions;
    } catch (error) {
        console.error('Error fetching PostgreSQL versions:', error);
        return ['latest'];
    }
}