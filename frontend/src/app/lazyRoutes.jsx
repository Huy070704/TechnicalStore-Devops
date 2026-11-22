export async function lazyPage(importer, exportName) {
    const mod = await importer();
    return { Component: mod[exportName] };
}
export async function lazyAuthScreen(importer, exportName) {
    const [{ AuthLayout }, screenMod] = await Promise.all([
        import('@/components/layout/AuthLayout'),
        importer(),
    ]);
    const Screen = screenMod[exportName];
    const Component = () => (<AuthLayout>
      <Screen />
    </AuthLayout>);
    return { Component };
}
