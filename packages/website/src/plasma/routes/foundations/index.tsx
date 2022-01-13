import * as React from 'react';
import {Route, Routes} from 'react-router-dom';

import {NotFound} from '../../NotFound';
import {IconsList} from './pages/IconsList';
import {SvgExamples} from './pages/SvgExamples';
import {Typekit} from './pages/typekit';

export const FoundationsRoutes: React.FunctionComponent = () => (
    <Routes>
        <Route path="Iconography" element={<IconsList />} />
        <Route path="Effects" element={<div />} />
        <Route path="SVG" element={<SvgExamples />} />
        <Route path="Illustration" element={<div />} />
        <Route path="Palette" element={<div />} />
        {/* TODO: roll existing Typekit components... */}
        <Route path="typekit/*" element={<Typekit />} />
        {/* ...into new Typekit section */}
        <Route path="Typekit" element={<div />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default FoundationsRoutes;