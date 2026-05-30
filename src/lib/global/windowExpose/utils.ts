import loadDynamicContent from '@/helpers/global/loadDynamicContent';
import * as useExternalSelector from '@/hooks/useExternalSelector';
import { externalDispatch } from '@/utils/externalDispatch';
import _ from 'lodash';


export const Utils = {
    loadDynamicContent,
    ...useExternalSelector,
    externalDispatch,
    _,
};