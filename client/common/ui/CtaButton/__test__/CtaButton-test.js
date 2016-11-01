import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import CtaButton from '../CtaButton'


describe("UI - CtaButton", function() {
  it("contains __container class", function() {
    expect(shallow(<CtaButton />).is('.ctabutton__container')).to.equal(true);
  });

  it("contains input", function() {
    expect(mount(<CtaButton />).find('button').length).to.equal(1);
  });

});
