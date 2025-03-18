import { ApiResponse, SocaityJob } from '../../types';
/**
 * Parses API responses into standardized formats
 */
export declare class ResponseParser {
    /**
     * Check if the response can be parsed by this parser
     */
    canParse(response: any): boolean;
    /**
     * Parse response into standardized job format
     */
    parse(response: ApiResponse): Promise<SocaityJob>;
    /**
     * Parse status from different API formats
     */
    private parseStatus;
    /**
     * Parse progress from different API formats
     */
    private parseProgress;
    private parseResult;
}
