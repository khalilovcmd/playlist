var _ = require('lodash');
var expect = require('chai').expect;
var sample = require('../content/samples/facebook/facebook_feed_response');

var Extractor = require('../backend/modules/extractor');

describe('extractor', function() {

    it('it should get all youtube ids',
        function() {

            var result = new Extractor(sample).extract();

            expect(result).to.not.be.null;
            expect(result.length > 0).to.be.ok;
            
        })

});