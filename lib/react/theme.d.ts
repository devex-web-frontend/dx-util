/// <reference types="react" />
import { ComponentClass, Component } from 'react';
import * as PropTypes from 'prop-types';
export declare type TTheme = {
    [key: string]: TTheme | string;
};
export declare function theme(name: string | symbol, defaultTheme?: TTheme): {
    <P extends {
        theme: TTheme;
    }>(Target: React.StatelessComponent<P & {
        theme: TTheme;
    }> & {
        config?: {
            name: string | symbol;
            theme: TTheme;
        } | undefined;
    }): ComponentClass<Pick<P, ({
        [P in keyof P]: P;
    } & {
        theme: never;
    } & {
        [key: string]: never;
    })[keyof P]> & {
        theme?: P["theme"] | undefined;
    }>;
    <P extends {
        theme: TTheme;
    }>(Target: ComponentClass<P & {
        theme: TTheme;
    }> & {
        config?: {
            name: string | symbol;
            theme: TTheme;
        } | undefined;
    }): ComponentClass<Pick<P, ({
        [P in keyof P]: P;
    } & {
        theme: never;
    } & {
        [key: string]: never;
    })[keyof P]> & {
        theme?: P["theme"] | undefined;
    }>;
};
/**
 * Merges passed themes by concatenating string keys and processing nested themes
 */
export declare function merge(...themes: TTheme[]): TTheme;
export declare type TThemeProviderProps = {
    theme: {
        [key: number]: TTheme;
    };
};
export declare class ThemeProvider extends Component<TThemeProviderProps> {
    static childContextTypes: {
        [x: string]: PropTypes.Requireable<any>;
    };
    render(): React.ReactElement<any>;
    getChildContext(): {
        theme: {
            [key: number]: TTheme;
        };
    };
}
