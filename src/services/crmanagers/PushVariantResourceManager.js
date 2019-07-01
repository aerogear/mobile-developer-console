import _ from 'lodash-es';
import { GenericResourceManager } from './GenericResourceManager';
import { PushApplicationCR } from '../../models/mobileservices/pushapplicationcr';

function poll(fnToBePolled, checkOutcome, timeout, interval) {
  const endTime = Number(new Date()) + (timeout || 2000);
  interval = interval || 100;

  const checkCondition = function(resolve, reject) {
    const promise = fnToBePolled();

    promise.then(data => {
      const res = checkOutcome(data);

      if (res) {
        resolve(res);
      } else if (Number(new Date()) < endTime) {
        setTimeout(checkCondition, interval, resolve, reject);
      } else {
        reject(new Error('timed out for'));
      }
    });
  };

  return new Promise(checkCondition);
}

export class PushVariantResourceManager extends GenericResourceManager {
  async create(user, res, variantData, mobileApp) {
    // TODO: Add code to check if an application already exists and to create it if it doesn't.
    // super.list(user, res)

    const apps = await super.list(user, res);
    let app = _.find(apps.items, item => item.metadata.name === mobileApp.metadata.name);

    if (!app) {
      app = await super.create(
        user,
        {
          name: 'pushapplications',
          version: 'v1alpha1',
          group: 'push.aerogear.org',
          kind: 'pushapplications',
          namespace: res.namespace
        },
        PushApplicationCR.newInstance({ name: mobileApp.metadata.name }),
        mobileApp
      );

      app = await poll(
        () => super.list(user, res),
        appList => {
          const foundApp = _.find(appList.items, item => item.metadata.name === mobileApp.metadata.name);
          if (foundApp.status) return foundApp;
          return null;
        },
        5000,
        1000
      );

      console.log('Created ', app);
    }

    variantData.spec.pushApplicationId = app.status.pushApplicationId;

    console.log('assign application id');

    const variantCR = _.find(res.variants, item => item.kind === variantData.kind);
    variantCR.namespace = res.namespace;

    return super.create(user, variantCR, variantData, mobileApp);
  }

  list(user, res, labels) {
    return Promise.all(res.variants.map(variantRes => super.list(user, variantRes, labels))).then(results => {
      const result = results[0];
      result.kind = 'Variants';
      delete result.metadata;
      result.items.push(...results[1].items);

      return result;
    });
  }
}
