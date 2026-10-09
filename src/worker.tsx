import { pages } from '@kad-products/shed/rwsdk/server';
import { except, layout, render, route } from 'rwsdk/router';
import { type DefaultAppContext, defineApp, type RequestInfo } from 'rwsdk/worker';
import AppDocument from '@/documents/app';
import DocsStandardLayout from '@/layouts/DocsStandard';
import Pages__docs from '@/pages/docs';

export default defineApp([
	render(AppDocument, [
		except<RequestInfo<DefaultAppContext>>(pages.handlePageError),
		layout(DocsStandardLayout, [route('/*', Pages__docs)]),
	]),
]);
