package stub

import (
	"context"

		"github.com/operator-framework/operator-sdk/pkg/sdk"
					)

func NewHandler() sdk.Handler {
	return &Handler{}
}

type Handler struct {
	// Fill me
}

func (h *Handler) Handle(ctx context.Context, event sdk.Event) error {
	//TODO: Implement Me!
	//The handler here will watch the changes of the Secrets in the namespace, and update the MobileClientStatus of a mobile client to populate the Services field
	//A Secret should be created/deleted when a mobile client is bound/unbound to a service. The secret data itself should contain information of the name of the mobile client, and the correspondibg service name
	//Based on this information, the handler here should:
	//1. retrieve the info of the client app from the secret
	//2. retrieve the service name from the secret
	//3. retrieve all the relavent info of the service (like url, configurations etc. They should be part of the secret data)
	//4. find the instance of the mobileclient use the name of the app
	//5. append/remove the service to the `Services` field and update the MobileClientStatus

	//switch o := event.Object.(type) {
	//case *v1alpha1.MobileClient:
	//	err := sdk.Create(newbusyBoxPod(o))
	//	if err != nil && !errors.IsAlreadyExists(err) {
	//		logrus.Errorf("Failed to create busybox pod : %v", err)
	//		return err
	//	}
	//}
	return nil
}

// newbusyBoxPod demonstrates how to create a busybox pod
//func newbusyBoxPod(cr *v1alpha1.MobileClient) *corev1.Pod {
//	labels := map[string]string{
//		"app": "busy-box",
//	}
//	return &corev1.Pod{
//		TypeMeta: metav1.TypeMeta{
//			Kind:       "Pod",
//			APIVersion: "v1",
//		},
//		ObjectMeta: metav1.ObjectMeta{
//			Name:      "busy-box",
//			Namespace: cr.Namespace,
//			OwnerReferences: []metav1.OwnerReference{
//				*metav1.NewControllerRef(cr, schema.GroupVersionKind{
//					Group:   v1alpha1.SchemeGroupVersion.Group,
//					Version: v1alpha1.SchemeGroupVersion.Version,
//					Kind:    "MobileApp",
//				}),
//			},
//			Labels: labels,
//		},
//		Spec: corev1.PodSpec{
//			Containers: []corev1.Container{
//				{
//					Name:    "busybox",
//					Image:   "busybox",
//					Command: []string{"sleep", "3600"},
//				},
//			},
//		},
//	}
//}
