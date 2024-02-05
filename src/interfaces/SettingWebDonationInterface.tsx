interface Thumbnail {
    thumbnail: string;
}

interface SettingWebDonationInterface {
    id: number;
    title: string;
    thumbnails: Array<Thumbnail>;
    description: string;
    created_at: string;
    updated_at: string;
}
