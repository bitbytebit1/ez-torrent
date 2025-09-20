import { addServerHandler, createResolver, defineNuxtModule, installModule } from '@nuxt/kit'
import { defu } from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
    enabled?: boolean | string
    users?:
    | {
        username: string
        password: string
    }[]
    | string
    usersDelimiter?: string
    allowedRoutes?: string[]
}

// Runtime config TypeScript interface definition
export type ModuleRuntimeConfig = ModuleOptions

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'basic-auth-cookie',
        configKey: 'basicAuthCookie',
    },
    // Default configuration options of the Nuxt module
    defaults: {
        enabled: true,
        users: [],
        cookieConfig: {
            // 1 week
            maxAge: 60 * 60 * 24 * 7,
            cookie: {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            },
        }
    },
    async setup(options, nuxt) {
        const { resolve } = createResolver(import.meta.url)

        /**
         * Add runtime config to the Nuxt instance
         */
        nuxt.options.runtimeConfig.basicAuthCookie = defu(
            nuxt.options.runtimeConfig.basicAuthCookie || {},
            options,
        )

        await installModule('nuxt-auth-utils')

        /**
         * Add the server middleware to the Nuxt instance
         */
        addServerHandler({
            middleware: true,
            handler: resolve('./runtime/server/middleware/basic-auth-cookie'),
        })
    },
})
