import { QueryEngine } from "llamaindex";

class LlamaIndexConficTest {
    private queryEngine: QueryEngine | null = null;
    private STORAGE_CACHE_DIR = './storage_cache';
    private STORAGE_DIR = './temp_storage';
    private bucketName: string;

    constructor(bucketName: string) {
        this.bucketName = bucketName;
    }
}
