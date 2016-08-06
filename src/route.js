/*eslint-disable*/
import path from 'path-to-regexp'

export function route (options = {}) {
    /**
     * String decoder
     * @param {String} str
     * @returns {*}
     */
    function decodeUri( str ) {
        try {
            str = decodeURIComponent( str );
        } catch( e ) {
            throw new Error( 'Cannot decodeURIComponent: ' + str );
        }
        return str;
    }

    return function( route ) {
        var keys = [],
        reg = path.apply( this, [ route, keys, options ]);

        return function( route, params ) {
            var res = reg.exec( route ),
            	params = params || {};

            if ( !res )
                return false;

            for ( var i = 1, l = res.length; i < l; i++ ) {

                if ( res[ i ] === undefined )
                    continue;

                params[ keys[ i - 1 ].name ] = decodeUri( res[ i ]);
            }

            return params;
        }
    }
}

export default route
